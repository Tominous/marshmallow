(function () {
	let ImageRecognition = function (imageURL, onResult) {
		let api = this.api,
			encodeQueryData = this.encodeQueryData,
			extractContents = this.extractContents,
			tigger = onResult
		if (typeof imageURL == "string" && api.urlPattern.test(imageURL) == true) {
			api.parameters.image_url = imageURL
			let beforeRequest = function () {
				return api.host + api.path + "?" + encodeQueryData(api.parameters)
			}
			this.request(
				beforeRequest(),
				api.method,
				function (res) {
					let a = extractContents(res)
					if (a) {
						tigger(a)
					}
				}
			)
		}
	}
	/**
	 *
	 * @param url
	 * @param method
	 * @param successHandler
	 * @param errorHandler
	 * @param isJson
	 */
	ImageRecognition.prototype.request = function (url, method, successHandler, errorHandler) {
		let
			request = require("request"),
			options = {
				url: url,
				headers: {
					"user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
				},
				method: method,
				followRedirect: true
			}
		request(options, function (err, res, body) {
				if (res.statusCode >= 200 && res.statusCode < 400) {
					successHandler && successHandler(body)
				}
			})
			.on('error', function () {
				errorHandler && errorHandler(arguments)
			})

	}
	/**
	 *
	 * @param data
	 * @returns {string}
	 * copyright http://stackoverflow.com/a/111545
	 */
	ImageRecognition.prototype.encodeQueryData = function (data) {
		let ret = []
		for (let d in data)
			ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
		return ret.join('&')
	}
	ImageRecognition.prototype.api = {
		host: "https://images.google.com/",
		path: "searchbyimage",
		method: "GET",
		parameters: {
			image_url: "",
			hl: "en"
		},
		urlPattern: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
	}
	/**
	 *
	 * @param stringDom
	 * @returns {*}
	 */
	ImageRecognition.prototype.extractContents = function (stringDom) {
		let DomParser = require('dom-parser'),
			a = new DomParser(),
			b = a.parseFromString(stringDom, "text/html")
		if (b.getElementsByClassName('_gUb')[0]) {
			return b.getElementsByClassName('_gUb')[0].textContent
		} else {
			return false
		}

	}
	module.exports = ImageRecognition
}.call(this))