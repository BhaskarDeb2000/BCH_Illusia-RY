import { Request, Response } from 'express';
import { Profile, UpdateProfileDto } from '../interfaces/profile.interface';
import { supabase } from '../config/supabase';

export class ProfileController {
    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('userId', userId)
                .single();

            if (error) {
                throw error;
            }

            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }

            return res.status(200).json(profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const updateData: UpdateProfileDto = req.body;

            const { data: profile, error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('userId', userId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return res.status(200).json(profile);
        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
} 