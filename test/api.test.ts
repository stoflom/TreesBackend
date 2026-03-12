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
  name: "API: query JSON passthrough to MongoDB (genus and species)",
  async fn() {
    const response = await fetch(`${BASE_URL}/treesjq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "genus.name": "Adenia", "species.name": "fruticosa" }),
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.length > 0);
    assertEquals(data[0].genus.name, "Adenia");
    assertEquals(data[0].species.name, "fruticosa");
  },
});

Deno.test({
  name: "API: query JSON passthrough to MongoDB (_id)",
  async fn() {
    const id = "622a132e4953a86709cb9635";
    const response = await fetch(`${BASE_URL}/treesjq`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "_id": id }),
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.length > 0);
    assertEquals(data[0]._id, id);
  },
});

Deno.test({
  name: "API: find common name matching regex (.*kameel.*)",
  async fn() {
    const response = await fetch(`${BASE_URL}/cname/.*kameel.*`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.length > 0);
  },
});

Deno.test({
  name: "API: find scientific species name matching regex (ataxa)",
  async fn() {
    const response = await fetch(`${BASE_URL}/sname/ataxa`, {
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
  name: "API: find genus with regex Acac.*",
  async fn() {
    const response = await fetch(`${BASE_URL}/genus/regex/Acac.*`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.length > 0);
    assertExists(data[0].name.startsWith("Acac"));
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
    assertEquals(data.name.toLowerCase(), "acanthaceae");
  },
});

Deno.test({
  name: "API: find family with regex .*ace.*",
  async fn() {
    const response = await fetch(`${BASE_URL}/family/regex/.*ace.*`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.length > 0);
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
