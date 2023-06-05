import { isLastish, sanitize } from "./hashtags";

describe('removeHashtags', () => {
    it('lastish should work', () => {
        const words = ['foo', '#bar', 'baz', '#gaz', '#jazz'];
        
        expect(isLastish(0, words)).toBeFalsy();
        expect(isLastish(1, words)).toBeFalsy();
        expect(isLastish(3, words)).toBeTruthy();
        expect(isLastish(4, words)).toBeTruthy();
    });

    it('keeping trailing punktuations should work', () => {
        expect('#SomeHash,'.replace(/.*([,.!?])$/, '$1')).toEqual(',');
        expect('#SomeHash.'.replace(/.*([,.!?])$/, '$1')).toEqual('.');
        expect('#SomeHash!'.replace(/.*([,.!?])$/, '$1')).toEqual('!');
        expect('#SomeHash?'.replace(/.*([,.!?])$/, '$1')).toEqual('?');
    });

    it('should remove leading and trailing quotes containing hashtags', () => {
        const input = `"Researchers developed FDNeRF, a "method" to create 3D faces with one image. #FaceNeRF #VideoEditing #AugmentedReality"`;
        const sanitized = `Researchers developed FDNeRF, a "method" to create 3D faces with one image.`;
        const hashtags = ['#FaceNeRF', '#VideoEditing', '#AugmentedReality'];

        const result = sanitize(input);

        expect(result.sanitized).toEqual(sanitized);
        expect(result.hashtags).toEqual(hashtags);
    });

    it('should remove leading and trailing quotes, before hashtags', () => {
        const input = `"Researchers developed FDNeRF, a "method" to create 3D faces with one image." #FaceNeRF #VideoEditing #AugmentedReality`;
        const sanitized = `Researchers developed FDNeRF, a "method" to create 3D faces with one image.`;
        const hashtags = ['#FaceNeRF', '#VideoEditing', '#AugmentedReality'];

        const result = sanitize(input);

        expect(result.sanitized).toEqual(sanitized);
        expect(result.hashtags).toEqual(hashtags);
    });

    it('should remove all trailing hashtags from the string', () => {
        const input = `Researchers developed FDNeRF, a method to create 3D faces with one image. #FaceNeRF #VideoEditing #AugmentedReality`;
        const sanitized = `Researchers developed FDNeRF, a method to create 3D faces with one image.`;
        const hashtags = ['#FaceNeRF', '#VideoEditing', '#AugmentedReality'];

        const result = sanitize(input);

        expect(result.sanitized).toEqual(sanitized);
        expect(result.hashtags).toEqual(hashtags);
    });

    it('should convert inner hashtags in the string', () => {
        const input = 'Researchers developed #FDNeRF, a method to create #3D #faces with one image.';
        const sanitized = `Researchers developed FDNeRF, a method to create 3D faces with one image.`;
        const hashtags = ['#FDNeRF', '#3D', '#faces'];

        const result = sanitize(input);

        expect(result.sanitized).toEqual(sanitized);
        expect(result.hashtags).toEqual(hashtags);
    });

    // TODO: fix this
    it.skip('should keep trailing punktuations', () => {
        const input = `Researchers developed #FDNeRF, a method to create 3D faces with one image #FaceNeRF #VideoEditing #AugmentedReality.`;
        const sanitized = `Researchers developed FDNeRF, a method to create 3D faces with one image.`;
        const hashtags = ['#FaceNeRF', '#VideoEditing', '#AugmentedReality'];

        const result = sanitize(input);

        expect(result.sanitized).toEqual(sanitized);
        expect(result.hashtags).toEqual(hashtags);
    });

    it('should return the original string if there are no hashtags', () => {
        const input = 'Researchers developed FDNeRF, a method to create 3D faces with one image.';

        const result = sanitize(input);

        expect(result.sanitized).toEqual(input);
        expect(result.hashtags).toEqual([]);
    });

    it('should return an empty string if the input is only hashtags', () => {
        const input = '#FaceNeRF #VideoEditing #AugmentedReality';

        const result = sanitize(input);

        expect(result.sanitized).toEqual('');
        expect(result.hashtags).toEqual(['#FaceNeRF', '#VideoEditing', '#AugmentedReality']);
    });

    it('should return an empty string for empty strings', () => {
        const input = '';

        const result = sanitize(input);

        expect(result.sanitized).toEqual('');
        expect(result.hashtags).toEqual([]);
    });

    it('should return undefined for undefined', () => {
        const input = undefined;

        const result = sanitize(input);

        expect(result.sanitized).toBeUndefined();
        expect(result.hashtags).toEqual([]);
    });
});