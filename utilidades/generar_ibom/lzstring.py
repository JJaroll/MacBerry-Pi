"""Compresion LZString (compressToBase64) en Python puro, compatible con la libreria JS que usa iBOM."""

_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="


def _compress(s, bits, to_char):
    if s is None:
        return ""
    dic, to_create = {}, {}
    w = ""
    enlarge, size, nbits = 2, 3, 2
    out, val, pos = [], 0, 0

    def put(v, n):
        nonlocal val, pos
        for _ in range(n):
            val = (val << 1) | (v & 1)
            if pos == bits - 1:
                pos = 0
                out.append(to_char(val))
                val = 0
            else:
                pos += 1
            v >>= 1

    def emit_w(word):
        nonlocal enlarge, nbits
        if word in to_create:
            c0 = ord(word[0])
            if c0 < 256:
                put(0, nbits)
                put(c0, 8)
            else:
                put(1, nbits)
                put(c0, 16)
            enlarge -= 1
            if enlarge == 0:
                enlarge = 2 ** nbits
                nbits += 1
            del to_create[word]
        else:
            put(dic[word], nbits)
        enlarge -= 1
        if enlarge == 0:
            enlarge = 2 ** nbits
            nbits += 1

    for c in s:
        if c not in dic:
            dic[c] = size
            size += 1
            to_create[c] = True
        wc = w + c
        if wc in dic:
            w = wc
        else:
            emit_w(w)
            dic[wc] = size
            size += 1
            w = c
    if w != "":
        emit_w(w)
    put(2, nbits)
    while True:
        val <<= 1
        if pos == bits - 1:
            out.append(to_char(val))
            break
        pos += 1
    return "".join(out)


def compress_to_base64(s):
    res = _compress(s, 6, lambda a: _KEY[a])
    return res + ("", "===", "==", "=")[len(res) % 4]
