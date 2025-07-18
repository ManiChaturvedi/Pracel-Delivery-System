const { routeParcel } = require('../src/parcelRouter');


describe('Insurance routing', () => {
  test('should add Insurance for value > 1000', () => {
    const parcel = { weight: 5, value: 1500 };
    const result = routeParcel(parcel);
    expect(result).toContain('Insurance');
  });

  test('should not add Insurance for value <= 1000', () => {
    const parcel = { weight: 5, value: 1000 };
    const result = routeParcel(parcel);
    expect(result).not.toContain('Insurance');
  });
});

describe('Weight-based routing', () => {
  test('should route to Mail for weight <= 1', () => {
    const parcel = { weight: 1, value: 500 };
    const result = routeParcel(parcel);
    expect(result).toContain('Mail');
  });

  test('should route to Regular for weight > 1 and <= 10', () => {
    const parcel = { weight: 5, value: 500 };
    const result = routeParcel(parcel);
    expect(result).toContain('Regular');
  });

  test('should route to Heavy for weight > 10', () => {
    const parcel = { weight: 15, value: 500 };
    const result = routeParcel(parcel);
    expect(result).toContain('Heavy');
  });
});

describe('Combined scenarios', () => {
  test('should route to both Insurance and Regular', () => {
    const parcel = { weight: 5, value: 1500 };
    const result = routeParcel(parcel);
    expect(result).toContain('Insurance');
    expect(result).toContain('Regular');
    expect(result).toHaveLength(2);
  });
});

describe('Edge cases', () => {
  test('should handle zero weight', () => {
    const parcel = { weight: 0, value: 500 };
    const result = routeParcel(parcel);
    expect(result).toContain('Mail');
  });

  test('should handle boundary weight 10', () => {
    const parcel = { weight: 10, value: 500 };
    const result = routeParcel(parcel);
    expect(result).toContain('Regular');
  });
});