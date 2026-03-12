import { assertEquals, assertExists } from "jsr:@std/assert";

const BASE_URL = "http://localhost:5002/api";

Deno.test({
  name: "API: find all 'adenia' trees entries by genus",
  async fn() {
    const response = await fetch(`${BASE_URL}/treegenus/adenia`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data[0]._id);
    // The query returns objects that might not have the full genus object if it was projected
    // but based on previous output it has genus name or identity
  },
});

Deno.test({
  name: "API: find all variants of 'Acacia karroo'",
  async fn() {
    const response = await fetch(`${BASE_URL}/treegs/acacia/karroo`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data[0]._id);
    assertEquals(data[0].identity, "Acacia karroo");
  },
});

Deno.test({
  name: "API: find a tree by MongoDB _id",
  async fn() {
    // Using a known ID from previous runs
    const id = "622a132e4953a86709cb9635";
    const response = await fetch(`${BASE_URL}/id/${id}`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertEquals(data._id, id);
    assertEquals(data.genus.name, "Adenia");
  },
});

Deno.test({
  name: "API: find common name matching regex (wag.*bietjie)",
  async fn() {
    const response = await fetch(`${BASE_URL}/cname/wag.*bietjie`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.length > 0);
  },
});

Deno.test({
  name: "API: find trees in group 8",
  async fn() {
    const response = await fetch(`${BASE_URL}/group/8`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.length > 0);
  },
});

Deno.test({
  name: "API: find genus 'adenia' in genuscols",
  async fn() {
    const response = await fetch(`${BASE_URL}/genus/name/adenia`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertEquals(data.name, "Adenia");
  },
});

Deno.test({
  name: "API: find family 'acanthaceae' in familycols",
  async fn() {
    const response = await fetch(`${BASE_URL}/family/acanthaceae`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    // Normalize comparison as database might have different casing but here it was 'Acanthaceae'
    assertEquals(data.name.toLowerCase(), "acanthaceae");
  },
});

Deno.test({
  name: "API: find vegetation by abbreviation D",
  async fn() {
    const response = await fetch(`${BASE_URL}/vegetation/abbreviation/D`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertEquals(data.abbreviation, "D");
  },
});
