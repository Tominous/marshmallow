exports.run = (c, suffix) => {
    suffix = suffix.toLowerCase()
    suffix = suffix.replace('a', '-')
    suffix = suffix.replace('b', '_')
    suffix = suffix.replace('c', '=')
    suffix = suffix.replace('d', '+')
    suffix = suffix.replace('e', '[')
    suffix = suffix.replace('f', '{')
    suffix = suffix.replace('g', '}')
    suffix = suffix.replace('h', ']')
    suffix = suffix.replace('i', ';')
    suffix = suffix.replace('j', ':')
    suffix = suffix.replace('k', '\'')
    suffix = suffix.replace('l', '"')
    suffix = suffix.replace('m', '\\')
    suffix = suffix.replace('n', '|')
    suffix = suffix.replace('o', ',')
    suffix = suffix.replace('p', '<')
    suffix = suffix.replace('q', '.')
    suffix = suffix.replace('r', '>')
    suffix = suffix.replace('s', '/')
    suffix = suffix.replace('t', '?')
    suffix = suffix.replace('u', 'τ')
    suffix = suffix.replace('v', '◙')
    suffix = suffix.replace('w', '$')
    suffix = suffix.replace('x', '&')
    suffix = suffix.replace('y', '^')
    suffix = suffix.replace('z', '%')
    c.message.author.openDM().then(u => {
        u.sendMessage(suffix)
    })
}
