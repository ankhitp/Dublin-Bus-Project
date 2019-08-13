describe("testing get lat long", function() {
    var geocoder = new google.maps.Geocoder();
    var geocoder2 = new google.maps.Geocoder();
    var sampletest = new getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');

    it("That json return is not null", function() {
    var sampletest = getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');

    expect(sampletest).toEqual(jasmine.anything());
    });

    // it("that json return has property", function() {
    // var testobject = getLatLng('Bray, County Wicklow, Ireland','Howth, Dublin, Ireland');
    // console.log("testobject", testobject)


    // expect(sampletest).toContain('Res');
    // });

})