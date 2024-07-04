function createProxyConfig(target) {
    return {
        target: target,
        secure: false,
        changeOrigin: true,
    };
}

var PROXY_CONF = {
    '/sdaDirector': createProxyConfig('https://www.sif.com.py'),
    '/sdaAdmin': createProxyConfig('https://www.sif.com.py'),
    '/sdaSecure': createProxyConfig('https://www.sif.com.py'),
};

module.exports = PROXY_CONF;