
// Lesscode-fp
const {
    $M, $, hint, trace, print, hash, lmap, Wait, mget, exit, mgettwo,
    linebreak, utf8, newline,
    l2String, s2List,
    FileRead, FileWrite,
    HttpGET } = require('lesscode-fp')



// processFile :: String -> String
const ProcessURL = name => {
    const computeHash = $(hash('sha256'), mget('data'))
    const contentLen = mgettwo('headers')('content-length')
    const LogData = name => async data => `${name} ${contentLen(data)} ${computeHash(data)}`
    const LogErorr = name => async err => `${name} 0  ${escape(err)}`
    return $M(
        trace(`Extracted metadata.............`), LogData(name),      // Success
        hint(`Downloaded ${name}..............`), HttpGET)(name)
        .catch($(trace(`[Fail] : ${name}......`), LogErorr(name)))    // Failure
}

// ProcessContent :: String -> String
const ProcessContent = input => 
    $M(
        trace('Convert List 2 String..........'), l2String(newline),
        trace('Waited.........................'), Wait,
        trace('Processed URLs.................'), lmap(ProcessURL),
        trace('Converted to List..............'), s2List(linebreak))(input)

const inputFile = process.argv[2]
const outputFile = process.argv[3]

// Main pipeline.
$M(
    trace('Wrote to output file................'), FileWrite(utf8)(outputFile),
    trace('Processed content...................'), ProcessContent,
    trace('Read input file.....................'), FileRead(utf8)
)(inputFile)
.catch(print)
