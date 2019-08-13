describe("testing get lat long", function() {
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    var sampletest = new getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');

    // it("tests that geocoder objects are created", function() {
    // var testobject = getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');
    // console.log("testobject", testobject)
    // expect(geocoder, geocoder2).toEqual(testobject);
    // });

    // it("that json return has property", function() {
    // var testobject = getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');
    // console.log("testobject", testobject)
    // expect(sampletest).toContain('Res');
    // });

    beforeEach(async function() {
    await getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');
    });

    it('does a thing', async function() {
    const result = await getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');

    console.log("result", result)

    expect(result).toContain('Res');
    });

})








// let programmer;
// beforeEach(() => {
//     programmer = new getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');
//     spyOn(programmer, 'sendRequest');
// });

// it('getlatlng should call sendRequest', () => {
//     // programmer.getName();
//     expect(sendRequest).toHaveBeenCalled();
// })