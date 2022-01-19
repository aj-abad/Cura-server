export default class Validation {
  public static validateEmail(email: string): boolean {
    const validator = require("email-validator");
    return validator.validate(email);
  }

  public static validateUuid(uuid: string): boolean {
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidPattern.test(uuid);
  }

  public static validateMobile(mobile: string): boolean {
    //valid Philippine mobile number prefixes
    const validPrefixes = [
      "817",
      "905",
      "906",
      "907",
      "908",
      "909",
      "910",
      "912",
      "915",
      "916",
      "917",
      "918",
      "919",
      "920",
      "921",
      "922",
      "923",
      "924",
      "925",
      "926",
      "927",
      "928",
      "929",
      "930",
      "931",
      "932",
      "933",
      "934",
      "935",
      "936",
      "937",
      "938",
      "939",
      "940",
      "941",
      "942",
      "943",
      "945",
      "946",
      "947",
      "948",
      "949",
      "950",
      "951",
      "953",
      "954",
      "955",
      "956",
      "961",
      "965",
      "966",
      "967",
      "973",
      "974",
      "975",
      "976",
      "977",
      "978",
      "979",
      "994",
      "995",
      "996",
      "997",
      "998",
      "999",
    ];
    if (validPrefixes.indexOf(mobile.substr(0, 3)) < 0) return false;
    if (mobile.length !== 10) return false;
    return true;
  }

  //intentionally lax because people got weird names
  public static validateName(name: string): boolean {
    if (name.trim().length === 0) return false;
    const namePattern = /^[\p{L}'][ \p{L}'-]*[\p{L}]$/;
    return namePattern.test(name);
  }
}
