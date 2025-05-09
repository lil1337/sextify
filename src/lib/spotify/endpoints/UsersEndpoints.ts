import type { User } from '../types/Spotify';
import EndpointsBase from './EndpointsBase';

export default class UsersEndpoints extends EndpointsBase {

    public profile(): Promise<User & {product: 'premium' | 'free' | 'open'}>;
    public profile(userId: string): Promise<User>;
    public profile(userId?: string): Promise<User | User & {product: 'premium' | 'free' | 'open'}> {
        if (!userId) return this.getRequest<User & {product: 'premium' | 'free' | 'open'}>(`me`);
        return this.getRequest<User>(`users/${userId}`);
    }
}
