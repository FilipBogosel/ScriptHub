
function OutputConsole({ title = 'Output:', content = 'Awaiting execution...' }) {
    return (
        <div className="output-console">
            <h3>{title}</h3>
            <pre><code>{content}</code></pre>
        </div>
    );
}

export default OutputConsole