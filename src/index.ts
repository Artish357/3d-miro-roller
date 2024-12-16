import { PanelData } from "./types/rollerContext";
import { generateRandomId } from "./util/helpers";

export async function init() {
  miro.board.ui.on("icon:click", async () => {
    await miro.board.ui.openPanel({ url: "miro.html" });
  });

  miro.board.events.on("roll-result", async (message) => {
    let messageString = String(message);
    if (messageString.length > 80) {
      messageString = "..." + messageString.slice(-75);
    }
    await miro.board.notifications.showInfo(messageString);
  });

  miro.board.ui.on(
    "custom:roll-formula-tag",
    async ({ items }: { items: { tagIds: string[]; content: string }[] }) => {
      const tagIdArray = items.flatMap((item) => item.tagIds);
      const tags = await miro.board.get({ type: "tag", id: tagIdArray });
      const content = items[0].content
        .replaceAll("&#43;", "+")
        .replaceAll("&#45;", "-");
      const [X, Y, Z] = [...content.matchAll(/([+-]?\d+)/g)]
        .map((x) => x[0])
        .map((x) => parseFloat(x))
        .concat([0, 0, 0]);
      const rolls = tags
        .map((tag) => {
          const formula = tag.title
            // If MOD placeholder is present, replace it with the actual value
            .replaceAll("X", `${X}`)
            .replaceAll("+X", `+${X}`)
            .replaceAll("-X", `-${X}`)
            .replaceAll("Y", `${Y}`)
            .replaceAll("+Y", `+${Y}`)
            .replaceAll("-Y", `-${Y}`)
            .replaceAll("Z", `${Z}`)
            .replaceAll("+Z", `+${Z}`)
            .replaceAll("-Z", `-${Z}`);
          const rollId = generateRandomId();
          return { formula, rollId };
        })
        .slice(0, 1); // Can't figure out sequential rolling yet
      const rollId = Math.random().toString(36).substring(7);
      miro.board.ui.openPanel<PanelData>({
        url: `miro.html?r=${rollId}`,
        data: { rolls, description: content },
      });
    }
  );
  await miro.board.experimental.action.register({
    event: "roll-formula-tag",
    ui: {
      label: { en: "Roll the attached tag formula" },
      icon: "cube",
    },
    scope: "local",
    predicate: {
      $where: "this.tagIds && this.tagIds.length > 0",
    },
    contexts: {
      item: {},
    },
  });
  miro.board.events.on("roll-result", async (message) => {
    let messageString = String(message);
    if (messageString.length > 80) {
      messageString = "..." + messageString.slice(-75);
    }
    await miro.board.notifications.showInfo(messageString);
  });
}

init();
