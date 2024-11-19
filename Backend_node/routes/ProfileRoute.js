
import express from 'express';
import { addInformations, getInformations,getAllProfiles } from '../Controllers/ProfileController.js'

const ProfileRouter = express.Router();


ProfileRouter.put('/Profile/:userId', addInformations);
ProfileRouter.get('/Profile/:userId',getInformations );
ProfileRouter.get('/Profiles',getAllProfiles );

export default ProfileRouter;
