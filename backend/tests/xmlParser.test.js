const { parseXmlBuffer } = require('../src/xmlParser');

describe('xmlParser', () => {
  describe('parseXmlBuffer', () => {
    test('should parse valid XML buffer successfully', async () => {
      const validXml = `
        <Container>
          <parcels>
            <Parcel>
              <Weight>5.5</Weight>
              <Value>1500</Value>
              <Receipient>
                <Name>John Doe</Name>
              </Receipient>
            </Parcel>
          </parcels>
        </Container>
      `;

      const buffer = Buffer.from(validXml);
      const result = await parseXmlBuffer(buffer);

      expect(result).toEqual({
        Container: {
          parcels: {
            Parcel: {
              Weight: '5.5',
              Value: '1500',
              Receipient: {
                Name: 'John Doe'
              }
            }
          }
        }
      });
    });

    test('should handle invalid XML buffer', async () => {
      const invalidXml = '<Container><unclosed>';
      const buffer = Buffer.from(invalidXml);

      await expect(parseXmlBuffer(buffer)).rejects.toThrow();
    });

    test('should handle empty XML buffer', async () => {
      const buffer = Buffer.from('');
      
      const result = await parseXmlBuffer(buffer);
      expect(result).toBeNull();
    });

    test('should handle XML with multiple parcels', async () => {
      const multiParcelXml = `
        <Container>
          <parcels>
            <Parcel>
              <Weight>1.5</Weight>
              <Value>500</Value>
              <Receipient>
                <Name>Alice</Name>
              </Receipient>
            </Parcel>
            <Parcel>
              <Weight>8.0</Weight>
              <Value>1200</Value>
              <Receipient>
                <Name>Bob</Name>
              </Receipient>
            </Parcel>
          </parcels>
        </Container>
      `;

      const buffer = Buffer.from(multiParcelXml);
      const result = await parseXmlBuffer(buffer);

      expect(result.Container.parcels.Parcel).toHaveLength(2);
      expect(result.Container.parcels.Parcel[0].Receipient.Name).toBe('Alice');
      expect(result.Container.parcels.Parcel[1].Receipient.Name).toBe('Bob');
    });

    test('should handle XML with special characters', async () => {
      const xmlWithSpecialChars = `
        <Container>
          <parcels>
            <Parcel>
              <Weight>2.5</Weight>
              <Value>750</Value>
              <Receipient>
                <Name>José &amp; María</Name>
              </Receipient>
            </Parcel>
          </parcels>
        </Container>
      `;

      const buffer = Buffer.from(xmlWithSpecialChars);
      const result = await parseXmlBuffer(buffer);

      expect(result.Container.parcels.Parcel.Receipient.Name).toBe('José & María');
    });
  });
});
