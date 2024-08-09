export async function init() {
  miro.board.ui.on("icon:click", async () => {
    await miro.board.ui.openPanel({ url: "app.html" });
  });
  miro.board.ui.on(
    "custom:roll-with-mod",
    (value: {items: { type: "text"; content: string }[]}) => {
      // extract only numbers from the text
      const rollMod = value.items[0].content.match(/[+-]?\d+/g)?.[0];
      if (rollMod) {
        miro.board.ui.openPanel({
          url: `app.html?roll-mod=${parseInt(
            rollMod
          )}&cache-buster=${Math.random() * Number.MAX_VALUE}`,
        });
      }
    }
  );
  miro.board.experimental.action.register({
    event: "roll-with-mod",
    ui: {
      label: { en: "Roll 2d6+MOD" },
      icon: "hexagon",
      description:
        "Rolls 2d6 and adds a modifier. The result is displayed in the widget",
    },
    scope: "local",
    predicate: {
      type: "text",
    },
    contexts: {
      item: {},
    },
  });
  miro.board.events.on("roll-result", async (message) => {
    let messageString = String(message);
    if (messageString.length > 80) {
      messageString = "..."+messageString.slice(-75)
    }
    await miro.board.notifications.showInfo(messageString);
  });
}

init();
