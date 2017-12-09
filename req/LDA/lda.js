function makeArray(t) {
	for (var s = new Array, i = 0; i < t; i++) s[i] = 0
	return s
}

function make2DArray(t, s) {
	for (var i = new Array, h = 0; h < t; h++) {
		i[h] = new Array
		for (var r = 0; r < s; r++) i[h][r] = 0
	}
	return i
}
var stem = require("stem-porter"),
	process = function (t, s, i, h, r, a, n) {
		var e = [],
			o = new Array,
			u = {},
			f = new Array,
			l = {}
		if (h = h || Array("en"), t && t.length > 0) {
			var m = new Array
			h.forEach(function (t) {
				var s = require("./stopwords_" + t + ".js")
				m = m.concat(s.stop_words)
			})
			for (var d = 0; d < t.length; d++)
				if ("" != t[d]) {
					o[d] = new Array
					var A = t[d].split(/[\s,\"]+/)
					if (A)
						for (var p = 0; p < A.length; p++) {
							var c = A[p].toLowerCase().replace(/[^a-z\'A-Z0-9\u00C0-\u00ff ]+/g, ""),
								v = stem(c)
							"" == c || !v || 1 == c.length || m.indexOf(c.replace("'", "")) > -1 || m.indexOf(v) > -1 || 0 == c.indexOf("http") || (u[v] ? u[v] = u[v] + 1 : v && (u[v] = 1, f.push(v), l[v] = c), o[d].push(f.indexOf(v)))
						}
				}
			var g = f.length,
				w = (o.length, parseInt(s)),
				y = r || .1,
				_ = a || .01
			lda.configure(o, g, 1e4, 2e3, 100, 10, n), lda.gibbs(w, y, _)
			lda.getTheta()
			for (var N = lda.getPhi(), E = i, I = 0; I < N.length; I++) {
				for (var L = new Array, c = 0; c < N[I].length; c++) L.push(N[I][c].toPrecision(2) + "_" + f[c] + "_" + l[f[c]])
				L.sort().reverse(), E > f.length && (E = f.length)
				for (var K = [], R = 0; R < E; R++) {
					var T = L[R].split("_")[2]
					if (!(parseInt(100 * L[R].split("_")[0]) < 2)) {
						var b = {}
						b.term = T, b.probability = parseFloat(L[R].split("_")[0]), K.push(b)
					}
				}
				e.push(K)
			}
		}
		return e
	},
	lda = new function () {
		this.configure = function (t, s, i, h, r, a, n) {
			this.ITERATIONS = i, this.BURN_IN = h, this.THIN_INTERVAL = r, this.SAMPLE_LAG = a, this.RANDOM_SEED = n, this.documents = t, this.V = s, this.dispcol = 0, this.numstats = 0
		}, this.initialState = function (t) {
			var s, i = this.documents.length
			for (this.nw = make2DArray(this.V, t), this.nd = make2DArray(i, t), this.nwsum = makeArray(t), this.ndsum = makeArray(i), this.z = new Array, s = 0; s < i; s++) this.z[s] = new Array
			for (var h = 0; h < i; h++) {
				var r = this.documents[h].length
				this.z[h] = new Array
				for (var a = 0; a < r; a++) {
					var n = parseInt("" + this.getRandom() * t)
					this.z[h][a] = n, this.nw[this.documents[h][a]][n]++, this.nd[h][n]++, this.nwsum[n]++
				}
				this.ndsum[h] = r
			}
		}, this.gibbs = function (t, s, i) {
			var h
			for (this.K = t, this.alpha = s, this.beta = i, this.SAMPLE_LAG > 0 && (this.thetasum = make2DArray(this.documents.length, this.K), this.phisum = make2DArray(this.K, this.V), this.numstats = 0), this.initialState(t), h = 0; h < this.ITERATIONS; h++) {
				for (var r = 0; r < this.z.length; r++)
					for (var a = 0; a < this.z[r].length; a++) {
						var n = this.sampleFullConditional(r, a)
						this.z[r][a] = n
					}
				h < this.BURN_IN && h % this.THIN_INTERVAL == 0 && this.dispcol++, h > this.BURN_IN && h % this.THIN_INTERVAL == 0 && this.dispcol++, h > this.BURN_IN && this.SAMPLE_LAG > 0 && h % this.SAMPLE_LAG == 0 && (this.updateParams(), h % this.THIN_INTERVAL != 0 && this.dispcol++), this.dispcol >= 100 && (this.dispcol = 0)
			}
		}, this.sampleFullConditional = function (t, s) {
			var i = this.z[t][s]
			this.nw[this.documents[t][s]][i]--, this.nd[t][i]--, this.nwsum[i]--, this.ndsum[t]--
				for (var h = makeArray(this.K), r = 0; r < this.K; r++) h[r] = (this.nw[this.documents[t][s]][r] + this.beta) / (this.nwsum[r] + this.V * this.beta) * (this.nd[t][r] + this.alpha) / (this.ndsum[t] + this.K * this.alpha)
			for (r = 1; r < h.length; r++) h[r] += h[r - 1]
			var a = this.getRandom() * h[this.K - 1]
			for (i = 0; i < h.length && !(a < h[i]); i++)
				return this.nw[this.documents[t][s]][i]++, this.nd[t][i]++, this.nwsum[i]++, this.ndsum[t]++, i
		}, this.updateParams = function () {
			for (var t = 0; t < this.documents.length; t++)
				for (s = 0; s < this.K; s++) this.thetasum[t][s] += (this.nd[t][s] + this.alpha) / (this.ndsum[t] + this.K * this.alpha)
			for (var s = 0; s < this.K; s++)
				for (var i = 0; i < this.V; i++) this.phisum[s][i] += (this.nw[i][s] + this.beta) / (this.nwsum[s] + this.V * this.beta)
			this.numstats++
		}, this.getTheta = function () {
			for (var t = new Array, s = 0; s < this.documents.length; s++) t[s] = new Array
			if (this.SAMPLE_LAG > 0)
				for (i = 0; i < this.documents.length; i++)
					for (h = 0; h < this.K; h++) t[i][h] = this.thetasum[i][h] / this.numstats
			else
				for (var i = 0; i < this.documents.length; i++)
					for (var h = 0; h < this.K; h++) t[i][h] = (this.nd[i][h] + this.alpha) / (this.ndsum[i] + this.K * this.alpha)
			return t
		}, this.getPhi = function () {
			for (var t = new Array, s = 0; s < this.K; s++) t[s] = new Array
			if (this.SAMPLE_LAG > 0)
				for (i = 0; i < this.K; i++)
					for (h = 0; h < this.V; h++) t[i][h] = this.phisum[i][h] / this.numstats
			else
				for (var i = 0; i < this.K; i++)
					for (var h = 0; h < this.V; h++) t[i][h] = (this.nw[h][i] + this.beta) / (this.nwsum[i] + this.V * this.beta)
			return t
		}, this.getRandom = function () {
			if (this.RANDOM_SEED) {
				var t = 1e6 * Math.sin(this.RANDOM_SEED++)
				return t - Math.floor(t)
			}
			return Math.random()
		}
	}
module.exports = process