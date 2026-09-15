"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidStellarAddress = isValidStellarAddress;
exports.isPositiveAmount = isPositiveAmount;
exports.validateProjectInput = validateProjectInput;
exports.validateMilestoneInput = validateMilestoneInput;
const stellar_sdk_1 = require("@stellar/stellar-sdk");
function isValidStellarAddress(value) {
    return Boolean(value && stellar_sdk_1.StrKey.isValidEd25519PublicKey(value));
}
function isPositiveAmount(value) {
    const numeric = typeof value === "string" ? Number(value) : value;
    return Number.isFinite(numeric) && numeric > 0;
}
function validateProjectInput(input) {
    const errors = {};
    if (!input.title?.trim())
        errors.title = "Project title is required.";
    if (!input.description?.trim())
        errors.description = "Project description is required.";
    if (!isValidStellarAddress(input.freelancer)) {
        errors.freelancer = "A valid Stellar public address is required.";
    }
    if (!isPositiveAmount(input.budget))
        errors.budget = "Budget must be a positive number.";
    if (!input.startDate)
        errors.startDate = "Start date is required.";
    if (!input.endDate)
        errors.endDate = "End date is required.";
    if (input.startDate && input.endDate) {
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            errors.startDate = "Dates must be valid.";
            errors.endDate = "Dates must be valid.";
        }
        else if (start >= end) {
            errors.endDate = "End date must be after the start date.";
        }
    }
    return { ok: Object.keys(errors).length === 0, errors };
}
function validateMilestoneInput(input) {
    const errors = {};
    if (!input.title?.trim())
        errors.title = "Milestone title is required.";
    if (!input.description?.trim())
        errors.description = "Milestone description is required.";
    if (!isPositiveAmount(input.amount))
        errors.amount = "Milestone amount must be positive.";
    if (!input.dueDate)
        errors.dueDate = "Due date is required.";
    return { ok: Object.keys(errors).length === 0, errors };
}
