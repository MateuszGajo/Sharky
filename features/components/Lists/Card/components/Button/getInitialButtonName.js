export default ({ relation, isInvited, isInvitationSent, subTitle }) => {
  if (relation) return "relation";
  if (isInvited) return "friendRequest";
  if (isInvitationSent) return "invitation";
  if (subTitle) return "joinLeave";
  return "add";
};
