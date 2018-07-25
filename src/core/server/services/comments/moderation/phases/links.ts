import linkify from "linkify-it";
import tlds from "tlds";

import {
  GQLACTION_TYPE,
  GQLCOMMENT_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { IntermediateModerationPhase } from "talk-server/services/comments/moderation";

/**
 * The preloaded linkify instance with common tlds.
 */
const testForLinks = linkify().tlds(tlds);

// This phase checks the comment if it has any links in it if the check is
// enabled.
export const links: IntermediateModerationPhase = (
  asset,
  tenant,
  comment,
  author
) => {
  if (tenant.premodLinksEnable && testForLinks.test(comment.body)) {
    // Add the flag related to Trust to the comment.
    return {
      status: GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
      actions: [
        {
          action_type: GQLACTION_TYPE.FLAG,
          group_id: "LINKS",
          metadata: {
            links: comment.body,
          },
        },
      ],
    };
  }

  return;
};