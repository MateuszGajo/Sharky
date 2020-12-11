export default (info, userId) => {
  const { userId: exists, inviter, relation } = info;
  if (relation) return "relation";
  if (inviter === userId) return "friendRequest";
  if (exists) return "invitation";
  return "add";
};
