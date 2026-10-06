#![cfg(test)]
extern crate std;

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::{StellarAssetClient, TokenClient},
    vec, Address, Env,
};

struct Ctx<'a> {
    env: Env,
    client: Address,
    freelancer: Address,
    escrow: EscrowClient<'a>,
    token: TokenClient<'a>,
}

fn setup<'a>() -> Ctx<'a> {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1_000);

    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let issuer = Address::generate(&env);
    let sac = env.register_stellar_asset_contract_v2(issuer);
    StellarAssetClient::new(&env, &sac.address()).mint(&client, &1_000);

    let id = env.register(Escrow, ());
    let escrow = EscrowClient::new(&env, &id);
    escrow.init(
        &client,
        &freelancer,
        &sac.address(),
        &vec![&env, 300_i128, 200_i128],
        &vec![&env, 2_000_u64, 3_000_u64],
    );
    let token = TokenClient::new(&env, &sac.address());
    Ctx { env, client, freelancer, escrow, token }
}

#[test]
fn init_locks_total_funds() {
    let c = setup();
    assert_eq!(c.token.balance(&c.client), 500);
    assert_eq!(c.token.balance(&c.escrow.address), 500);
}

#[test]
fn client_releases_milestone() {
    let c = setup();
    c.escrow.release(&0);
    assert_eq!(c.token.balance(&c.freelancer), 300);
    assert_eq!(c.escrow.milestones().get(0).unwrap().status, Status::Released);
}

#[test]
fn cannot_release_twice() {
    let c = setup();
    c.escrow.release(&0);
    assert_eq!(c.escrow.try_release(&0), Err(Ok(Error::AlreadyReleased)));
}

#[test]
fn freelancer_cannot_claim_before_deadline() {
    let c = setup();
    c.escrow.submit(&0);
    assert_eq!(c.escrow.try_claim(&0), Err(Ok(Error::DeadlineNotReached)));
}

#[test]
fn freelancer_cannot_claim_without_submitting() {
    let c = setup();
    c.env.ledger().set_timestamp(2_500);
    assert_eq!(c.escrow.try_claim(&0), Err(Ok(Error::NotSubmitted)));
}

#[test]
fn freelancer_claims_submitted_work_after_deadline() {
    let c = setup();
    c.escrow.submit(&0);
    c.env.ledger().set_timestamp(2_500);
    c.escrow.claim(&0);
    assert_eq!(c.token.balance(&c.freelancer), 300);
}

#[test]
fn client_refunds_undelivered_milestone_after_deadline() {
    let c = setup();
    assert_eq!(c.escrow.try_refund(&1), Err(Ok(Error::DeadlineNotReached)));
    c.env.ledger().set_timestamp(3_500);
    c.escrow.refund(&1);
    assert_eq!(c.token.balance(&c.client), 700);
    assert_eq!(c.escrow.try_refund(&1), Err(Ok(Error::AlreadyReleased)));
}

#[test]
fn client_cannot_refund_delivered_work() {
    let c = setup();
    c.escrow.submit(&0);
    c.env.ledger().set_timestamp(2_500);
    assert_eq!(c.escrow.try_refund(&0), Err(Ok(Error::DeliveredWorkPending)));
}

#[test]
fn invalid_milestone_index_rejected() {
    let c = setup();
    assert_eq!(c.escrow.try_release(&9), Err(Ok(Error::InvalidMilestone)));
}

#[test]
fn cannot_initialize_twice() {
    let c = setup();
    let r = c.escrow.try_init(
        &c.client,
        &c.freelancer,
        &c.token.address,
        &vec![&c.env, 1_i128],
        &vec![&c.env, 1_u64],
    );
    assert_eq!(r, Err(Ok(Error::AlreadyInitialized)));
}

#[test]
fn info_returns_parties_and_token() {
    let c = setup();
    let info = c.escrow.info();
    assert_eq!(info.client, c.client);
    assert_eq!(info.freelancer, c.freelancer);
    assert_eq!(info.token, c.token.address);
}

#[test]
fn info_fails_before_init() {
    let env = Env::default();
    let id = env.register(Escrow, ());
    let escrow = EscrowClient::new(&env, &id);
    assert_eq!(escrow.try_info(), Err(Ok(Error::NotInitialized)));
}
