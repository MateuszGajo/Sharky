export default ({ relation, isInvited, isInvitationSent, subTitle }) => {
  if (relation) return "relation";
  else if (isInvited) return "friendRequest";
  else if (isInvitationSent) return "invitation";
  else if (subTitle) return "joinLeave";
  else return "add";
};
