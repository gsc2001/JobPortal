import { Alert } from '../store/alerts';
import { RatingMap } from './types';

export const randomNumber = (max: number) => Math.floor(Math.random() * max);

export const getRatingfromMap = (ratingMap: RatingMap): number => {
    let rating = 0;
    Object.values(ratingMap).forEach(value => (rating += value));
    const nRating = Object.keys(ratingMap).length;
    if (nRating === 0) rating = -1;
    else rating = rating / nRating;
    return rating;
};
