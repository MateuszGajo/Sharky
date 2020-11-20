export default (info, userId) => {
  const { userId: exists, inviter, relation } = info;
  if (relation) return "relation";
  else if (inviter === userId) return "friendRequest";
  else if (exists) return "invitation";
  else return "add";
};
