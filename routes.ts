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

import {
  Application,
  Context,
  Router,
  Status,
} from "https://deno.land/x/oak@v17.1.3/mod.ts";

async function findThumbnail(ctx: Context, id: string) {
  const maxresFetch = await fetch(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  );
  await maxresFetch.body?.cancel();

  if (maxresFetch!.status === 404) {
    ctx.response.redirect(
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    );
    return;
  }

  ctx.response.redirect(
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
  );
}

const indexBody = await Deno.readTextFile("./index.html");
const errorBody = await Deno.readTextFile("./bad_request.html");
const faviconFile = await Deno.readFile("./favicon.png");

export const router = new Router()
  .get("/", (ctx) => {
    ctx.response.body = indexBody;
    ctx.response.type = "text/html";
  })
  .get("/favicon.png", (ctx) => {
    ctx.response.body = faviconFile;
    ctx.response.type = "image/png";
  })
  .get("/watch", async (ctx) => {
    const id = ctx.request.url.searchParams.get("v");
    if (id === null) {
      ctx.response.body = errorBody;
      ctx.response.type = "text/html";
      ctx.response.status = Status.BadRequest;
      return;
    }

    await findThumbnail(ctx, id);
  })
  .get("/:id", async (ctx) => {
    const id = ctx.params.id;
    await findThumbnail(ctx, id);
  });

export function setupRoutes(app: Application) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}
