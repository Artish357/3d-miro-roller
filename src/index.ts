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
      const modString = /[+-]\d+/.exec(content)?.[0] ?? "";
      const formulas = tags
        .map((tag) =>
          tag.title
            // If MOD placeholder is present, replace it with the actual value
            .replaceAll("{MOD}", modString)
        )
        .slice(0, 1); // Can't figure out sequential rolling yet
      console.log("formulas", formulas, content);
      miro.board.ui.openPanel({
        url: `miro.html?r=${Math.random()}`,
        data: { formulas },
      });
    }
  );
  await miro.board.experimental.action.register({
    event: "roll-formula-tag",
    ui: {
      label: { en: "Roll the attached tag formula" },
      icon: "hexagon",
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
