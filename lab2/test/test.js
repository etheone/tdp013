var request = require('superagent');
var assert = require("assert");
var func = require("../functions");

var URL = 'http://localhost:3000';

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });

  });
});

describe('Functions', function() {

    describe('Testing saveMessage', function () {
	
	it('should have a status code 200', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save/?message=hejvadbradetgar')
		.end(function (err, response) {

		    assert.equal(response.status, 200);
		    done();
		    
		});

	});


	it('should have a status code 200', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save/?message=hejvadbradetgar2')
		.end(function (err, response) {

		    assert.equal(response.status, 200);
		    done();
		    
		});

	});

	it('should have a status code 400', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save/?messag=')
		.end(function (err, response) {

		    assert.equal(response.status, 400);
		    done();
		    
		});

	});

	
	it('should have a status code 400', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save/?message=hejhejhejhejhkasjdkajdlkwajdkawjdjawkdjawlkdjalkwdjaejhejhejhejhejhejehejehejhejehehehehejehjehehehehehehehehehehehehehehehehewrjhefsdjohfeakdjwakdjkwajöhfdsöofdöjohfsdjöhofsjoöhfsdjöhfsdöofjhsoöfeöjhfeöljföelsj')
		.end(function (err, response) {

		    assert.equal(response.status, 400);
		    done();
 
		});
	});
	
	it('should have a status code 400', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save/?message=')
		.end(function (err, response) {

		    assert.equal(response.status, 400);
		    done();
		    
		});
	});
    }); 

    describe('Testing getAll', function () {
	
	it('should have a status code 404', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/getAll/1232')
		.end(function (err, response) {

		    assert.equal(response.status, 404);
		    done();
		    
		});
	});

	it('should have a status code 400', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/getAll/?1232')
		.end(function (err, response) {

		    assert.equal(response.status, 400);
		    done();
		    
		});
	});
	
	
	it('should have a status code 200', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/getAll')
		.end(function (err, response) {
		    
		    id = response.res.body[0]['_id'];
		    assert.equal(response.status, 200);
		    done();
		    
		});
	});
    });
    
    describe('Testing flagMessage', function () {
	
	it('should have a status code 200', function (done) {
	    this.timeout(9000);
	    
	    request
		.get(URL + '/flag/?id=' + id)
		.end(function (err, response) {


		    assert.equal(response.status, 200);
		    done();
		    
		});
	});

    	it('should return true and status code 200', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/getAll')
		.end(function (err, response) {
		    
		    assert.equal(response.res.body[0]['flag'], true);
		    assert.equal(response.status, 200);
		    done();
		    
		    
		});
	});

	it('should return false and status code 200', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/getAll')
		.end(function (err, response) {
		    
		    assert.equal(response.res.body[1]['flag'], false);
		    assert.equal(response.status, 200);
		    done();
		    
		    
		});
	});

	it('Flagging unknowd id, should return status 400', function (done) {
	    this.timeout(9000);
	    
	    request
		.get(URL + '/flag/?id=55f15e8086d281941077ce93')
		.end(function (err, response) {
		    

		    assert.equal(response.status, 400);
		    done();
		    
		});
	});
    });
    
});



