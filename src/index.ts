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
    async ({ items }: { items: { tagIds: string[] }[] }) => {
      const tagIdArray = items.flatMap((item) => item.tagIds);
      const tags = await miro.board.get({ type: "tag", id: tagIdArray });
      const formulas = tags.map((tag) => tag.title);
      miro.board.ui.openPanel({
        url: `miro.html?r=${Math.random()}`,
        data: { formulas: [formulas[0]] }, // Can't figure out sequential rolling yet
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
