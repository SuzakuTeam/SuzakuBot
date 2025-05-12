async function events(m, { system }) {
  if (m.type === "interactiveResponseMessage" && m.quoted.fromMe) {
    system.appendTextMessage(
      m,
      JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id,
      m,
    );
  }
  if (m.type === "templateButtonReplyMessage" && m.quoted.fromMe) {
    system.appendTextMessage(m, m.msg.selectedId, m);
  }
}

module.exports = {
  events,
};
