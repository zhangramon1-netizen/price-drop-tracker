// Tests: small programs that check our logic gives the answers we expect.
// If someone breaks the logic later, these fail and GitHub blocks the change.
import { test } from "node:test";
import assert from "node:assert/strict";
import { priceDrop, shouldRebook, formatMoney } from "../logic.js";

test("priceDrop returns the savings when the price fell", () => {
  assert.equal(priceDrop(320, 270), 50);
});

test("priceDrop is 0 when the price rose or stayed the same", () => {
  assert.equal(priceDrop(320, 400), 0);
  assert.equal(priceDrop(320, 320), 0);
});

test("priceDrop is 0 when we don't know the current price", () => {
  assert.equal(priceDrop(320, null), 0);
});

test("priceDrop avoids floating point noise", () => {
  assert.equal(priceDrop(0.3, 0.1), 0.2);
});

test("shouldRebook needs a drop AND a refundable booking", () => {
  assert.equal(shouldRebook({ paid: 300, currentPrice: 250, refundable: true }), true);
  assert.equal(shouldRebook({ paid: 300, currentPrice: 250, refundable: false }), false);
  assert.equal(shouldRebook({ paid: 300, currentPrice: 350, refundable: true }), false);
});

test("formatMoney shows two decimals", () => {
  assert.equal(formatMoney(5), "$5.00");
});
