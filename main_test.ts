// Thumber
// Copyright (C) 2024 Willian Vinagre
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { assert } from "jsr:@std/assert";
import { testing } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { router } from "./routes.ts";

const videoId = "jNQXAC9IVRw";

const getMock = async (path: string) => {
  const ctx = testing.createMockContext({
    path: path,
  });
  const next = testing.createMockNext();
  await router.routes()(ctx, next);
  await router.allowedMethods()(ctx, next);
  return ctx;
};

Deno.test("index test", async () => {
  const ctx = await getMock("/");
  assert(ctx.response.status === 200);
});

Deno.test("favicon test", async () => {
  const ctx = await getMock("/favicon.png");
  assert(ctx.response.status === 200);
  assert(ctx.response.type === "image/png");
});

Deno.test("watch id test", async () => {
  const ctx = await getMock(`/watch?v=${videoId}`);
  assert(ctx.response.status === 302);
  assert(
    ctx.response.headers.get("Location")! ===
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  );
});

Deno.test("id test", async () => {
  const ctx = await getMock(`/${videoId}`);
  assert(ctx.response.status === 302);
  assert(
    ctx.response.headers.get("Location")! ===
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  );
});
