#![no_std]
//! Milestone-based escrow for StellaTrust.
//!
//! A client locks funds for a freelancer split into milestones. The client
//! releases each milestone as work is accepted. If the client goes silent past
//! a milestone's deadline the freelancer can claim it; the client can reclaim
//! unreleased funds only after the deadline of the milestone has passed
//! without the freelancer having delivered (marked as submitted).

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, Env, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InvalidAmount = 3,
    InvalidMilestone = 4,
    AlreadyReleased = 5,
    NotSubmitted = 6,
    DeadlineNotReached = 7,
    DeliveredWorkPending = 8,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Status {
    Pending,
    Submitted,
    Released,
    Refunded,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub amount: i128,
    pub deadline: u64,
    pub status: Status,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Client,
    Freelancer,
    Token,
    Milestones,
}

#[contract]
pub struct Escrow;

fn load<T: soroban_sdk::TryFromVal<Env, soroban_sdk::Val>>(
    env: &Env,
    key: &DataKey,
) -> Result<T, Error> {
    env.storage()
        .instance()
        .get(key)
        .ok_or(Error::NotInitialized)
}

fn milestone_at(milestones: &Vec<Milestone>, index: u32) -> Result<Milestone, Error> {
    milestones.get(index).ok_or(Error::InvalidMilestone)
}

#[contractimpl]
impl Escrow {
    /// Create the escrow and pull the total of all milestone amounts from the
    /// client into the contract.
    pub fn init(
        env: Env,
        client: Address,
        freelancer: Address,
        token: Address,
        amounts: Vec<i128>,
        deadlines: Vec<u64>,
    ) -> Result<(), Error> {
        if env.storage().instance().has(&DataKey::Client) {
            return Err(Error::AlreadyInitialized);
        }
        client.require_auth();
        if amounts.is_empty() || amounts.len() != deadlines.len() {
            return Err(Error::InvalidMilestone);
        }

        let mut milestones = Vec::new(&env);
        let mut total: i128 = 0;
        for i in 0..amounts.len() {
            let amount = amounts.get_unchecked(i);
            if amount <= 0 {
                return Err(Error::InvalidAmount);
            }
            total = total.checked_add(amount).ok_or(Error::InvalidAmount)?;
            milestones.push_back(Milestone {
                amount,
                deadline: deadlines.get_unchecked(i),
                status: Status::Pending,
            });
        }

        token::Client::new(&env, &token).transfer(
            &client,
            env.current_contract_address(),
            &total,
        );

        let s = env.storage().instance();
        s.set(&DataKey::Client, &client);
        s.set(&DataKey::Freelancer, &freelancer);
        s.set(&DataKey::Token, &token);
        s.set(&DataKey::Milestones, &milestones);
        Ok(())
    }

    /// Freelancer signals that a milestone has been delivered.
    pub fn submit(env: Env, index: u32) -> Result<(), Error> {
        let freelancer: Address = load(&env, &DataKey::Freelancer)?;
        freelancer.require_auth();
        let mut milestones: Vec<Milestone> = load(&env, &DataKey::Milestones)?;
        let mut m = milestone_at(&milestones, index)?;
        if m.status != Status::Pending {
            return Err(Error::AlreadyReleased);
        }
        m.status = Status::Submitted;
        milestones.set(index, m);
        env.storage().instance().set(&DataKey::Milestones, &milestones);
        Ok(())
    }

    /// Client accepts the work and pays the freelancer.
    pub fn release(env: Env, index: u32) -> Result<(), Error> {
        let client: Address = load(&env, &DataKey::Client)?;
        client.require_auth();
        Self::pay_freelancer(&env, index, false)
    }

    /// Freelancer claims a submitted milestone once its deadline has passed
    /// and the client has not released it.
    pub fn claim(env: Env, index: u32) -> Result<(), Error> {
        let freelancer: Address = load(&env, &DataKey::Freelancer)?;
        freelancer.require_auth();
        Self::pay_freelancer(&env, index, true)
    }

    /// Client reclaims a milestone the freelancer never delivered, after the
    /// deadline has passed.
    pub fn refund(env: Env, index: u32) -> Result<(), Error> {
        let client: Address = load(&env, &DataKey::Client)?;
        client.require_auth();
        let token: Address = load(&env, &DataKey::Token)?;
        let mut milestones: Vec<Milestone> = load(&env, &DataKey::Milestones)?;
        let mut m = milestone_at(&milestones, index)?;
        match m.status {
            Status::Pending => {}
            Status::Submitted => return Err(Error::DeliveredWorkPending),
            _ => return Err(Error::AlreadyReleased),
        }
        if env.ledger().timestamp() <= m.deadline {
            return Err(Error::DeadlineNotReached);
        }
        m.status = Status::Refunded;
        let amount = m.amount;
        milestones.set(index, m);
        env.storage().instance().set(&DataKey::Milestones, &milestones);
        token::Client::new(&env, &token).transfer(
            &env.current_contract_address(),
            &client,
            &amount,
        );
        Ok(())
    }

    pub fn milestones(env: Env) -> Result<Vec<Milestone>, Error> {
        load(&env, &DataKey::Milestones)
    }

    fn pay_freelancer(env: &Env, index: u32, require_deadline: bool) -> Result<(), Error> {
        let freelancer: Address = load(env, &DataKey::Freelancer)?;
        let token: Address = load(env, &DataKey::Token)?;
        let mut milestones: Vec<Milestone> = load(env, &DataKey::Milestones)?;
        let mut m = milestone_at(&milestones, index)?;
        match m.status {
            Status::Submitted => {}
            Status::Pending if !require_deadline => {}
            Status::Pending => return Err(Error::NotSubmitted),
            _ => return Err(Error::AlreadyReleased),
        }
        if require_deadline && env.ledger().timestamp() <= m.deadline {
            return Err(Error::DeadlineNotReached);
        }
        m.status = Status::Released;
        let amount = m.amount;
        milestones.set(index, m);
        env.storage().instance().set(&DataKey::Milestones, &milestones);
        token::Client::new(env, &token).transfer(
            &env.current_contract_address(),
            &freelancer,
            &amount,
        );
        Ok(())
    }
}

#[cfg(test)]
mod test;
