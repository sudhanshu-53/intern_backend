import { DatabaseReader, QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";

// Define our auth configuration
export const config = {
  providers: [],
  allowAnonymousUsers: true
};

// Helper function to get the authenticated user ID
async function getAuthUserId(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject || null;
}

// Query to get the currently logged in user
export const loggedInUser = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("_id"), userId))
      .first();
    return user;
  },
});
