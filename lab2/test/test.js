var request = require('superagent');
var assert = require("assert");
var func = require("../lib/functions");

var server = require('../lib/app');

server.start();


var URL = 'http://localhost:3000';

describe('Functions', function() {

    describe('Testing post', function () {
	
	it('should have a 405 status code', function (done) {
	    this.timeout(9000);

	    request
		.post(URL + '/hej')
		.end(function (err, response) {

		    assert.equal(response.status, 405);
		    done();
		    
		});

	});

    });

    describe('Testing root', function () {
	
	it('should have a 200 status code', function (done) {
	    this.timeout(9000);

	    request
		.get(URL)
		.end(function (err, response) {

		    assert.equal(response.status, 200);
		    done();
		    
		});

	});

    });
    
    describe('Testing saveMessage', function () {
	
	it('should have a status code 200', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save?message=hejvadbradetgar')
		.end(function (err, response) {

		    assert.equal(response.status, 200);
		    done();
		    
		});

	});


	it('should have a status code 200', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save?message=hejvadbradetgar2')
		.end(function (err, response) {

		    assert.equal(response.status, 200);
		    done();
		    
		});

	});

	it('should have a status code 400', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save?messag=')
		.end(function (err, response) {

		    assert.equal(response.status, 400);
		    done();
		    
		});

	});

	
	it('should have a status code 400', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save?message=hejhejhejhejhkasjdkajdlkwajdkawjdjawkdjawlkdjalkwdjaejhejhejhejhejhejehejehejhejehehehehejehjehehehehehehehehehehehehehehehehewrjhefsdjohfeakdjwakdjkwajöhfdsöofdöjohfsdjöhofsjoöhfsdjöhfsdöofjhsoöfeöjhfeöljföelsj')
		.end(function (err, response) {

		    assert.equal(response.status, 400);
		    done();
 
		});
	});
	
	it('should have a status code 400', function (done) {
	    this.timeout(9000);

	    request
		.get(URL + '/save?message=')
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
		.get(URL + '/getAll?1232')
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
		.get(URL + '/flag?id=' + id)
		.end(function (err, response) {


		    assert.equal(response.status, 200);
		    done();
		    
		});
	});

	it('should have a status code 400', function (done) {
	    this.timeout(9000);
	    
	    request
		.get(URL + '/flag?id=1')
		.end(function (err, response) {


		    assert.equal(response.status, 400);
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
		.get(URL + '/flag?id=55f15e8086d281941077ce93')
		.end(function (err, response) {
		    

		    assert.equal(response.status, 400);
		    done();
		    
		});
	});

    });
    
});



