class IssuerDto {
  constructor(issuer) {
    this.orgName = issuer.orgName;
    this.address = issuer.address;
    this.docType = issuer.docType;
  }
}

export default IssuerDto;
