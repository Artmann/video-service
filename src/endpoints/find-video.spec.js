const findVideo = require('./find-video');

describe('FindVideo', () => {
  describe('returns the Youtube id for a video matching the `title` and `artists`.', () => {
    const testCases = [
      [['Llama in My Living Room', 'AronChupa', 'Little Sis Nora'], 'l-sZyfFX4F0'],
      [['Barbie Girl', 'Aqua'], 'ZyhrYis509A'],
      [['Boasty (feat. Idris Elba)'], 'huaE85-V8u4'],
      [['Freaks - Radio Edit', 'Timmy Trumpet'], 'nz6xW7kPIDI'],
      [['Grapevine', 'Tiesto'], 'X4u-94d_V1o']
    ];

    it.each(testCases)('%p => %p', async (args, expectedId) => {
      const response = await findVideo(args);

      expect(response.video).toEqual({
        id: expectedId
      });
    });
  });
});
