const resolvers = require('../cast');

describe('Cast Resolvers', () => {
  it('should get photo with size from args', () => {
    const res = resolvers.Cast.photo({ profile_path: 'lol/' }, { size: 999 });

    // we don't care about the specific url as much
    // as checking to see if the args and profile path
    // were passed through
    expect(res).toContain('lol');
    expect(res).toContain('999');
  });

  it('should return `m`, `f`, or null for gender', () => {
    expect(resolvers.Cast.gender({ gender: 1 })).toEqual('f');
    expect(resolvers.Cast.gender({ gender: 2 })).toEqual('m');
    expect(resolvers.Cast.gender({ gender: 3 })).toEqual(null);
  });
});
