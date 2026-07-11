const Team = require('../models/Team');
const AppError = require('../utils/AppError');

exports.createTeam = async (userId, data) => {
  const team = await Team.create({
    name: data.name,
    members: [userId],
    createdBy: userId,
    targetCity: data.targetCity,
    targetLocality: data.targetLocality,
  });

  return team.populate('members', 'name profileImage city');
};

exports.getTeam = async (teamId) => {
  const team = await Team.findById(teamId)
    .populate('members', 'name profileImage city age occupation')
    .populate('createdBy', 'name profileImage');
  if (!team) throw new AppError('Team not found', 404);
  return team;
};

exports.joinTeam = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team) throw new AppError('Team not found', 404);
  if (team.status !== 'active') throw new AppError('Team is no longer active', 400);

  const isMember = team.members.some((m) => m.toString() === userId.toString());
  if (isMember) throw new AppError('Already a member of this team', 400);

  team.members.push(userId);
  await team.save();

  return team.populate('members', 'name profileImage city age occupation');
};

exports.leaveTeam = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team) throw new AppError('Team not found', 404);

  team.members = team.members.filter((m) => m.toString() !== userId.toString());

  if (team.members.length === 0) {
    team.status = 'disbanded';
  }

  await team.save();
  return team;
};
