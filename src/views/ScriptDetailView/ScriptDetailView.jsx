import FormGroup from "../../components/forms/FormGroup";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import OutputConsole from "../../components/forms/OutputConsole";
import CategoryBadge from "../../components/common/CategoryBadge";



function ScriptDetailView({
    script,
    scriptType = 'official',
    formData = {},
    onFormChange,
    onRun,
    onDownload,
    onUpload,
    onBack,
    onBrowse,
    isRunning = false,
    isDownloading = false,
    isUploading = false,
    output = 'Awaiting execution...',
    executionError = '',

}) {

    const renderInput = (param) => {
        // param object structure:
        // {
        //   name: "folder-path",
        //   label: "Folder to organize:",
        //   type: "file", // or "text", "select", "number", "checkbox"
        //   placeholder: "C:\\Users\\Name\\Downloads",
        //   required: true,
        //   options: [] // only for select type
        // }
        switch (param.type) {
            case 'select':
                return (
                    <Select
                        options={param.options}
                        id={param.name}
                        name={param.name}
                        value={formData[param.name] || ''}
                        required={param.required}
                        onChange={(e) => onFormChange(param.name, e.target.value)}
                        className="input-group"
                    ></Select>
                );
            case 'file':
                return (
                    <div className="input-group">
                        <Input
                            type="text"
                            value={formData[param.name]}
                            placeholder={param.placeholder}
                            onChange={(e) => onFormChange(param.name, e.target.value)}
                            required={param.required}

                        />

                        <Button
                            className="browse-button"
                            type="button"
                            onClick={() => onBrowse(param.name)}
                        >Browse...</Button>
                    </div>
                );
            default:
                return (
                    <Input
                        type="text"
                        value={formData[param.name]}
                        placeholder={param.placeholder}
                        onChange={(e) => onFormChange(param.name, e.target.value)}
                        required={param.required}
                    />
                );

        }

    }
    if(!script) {
        return(<div>Script not found</div>)
    }
    return (
        <section id="script-detail-view" className="view-section">
            <div className="script-detail-header">
                <Button className="back-button" onClick={onBack}>⬅</Button>
                <h2>{script.name}</h2>
                <CategoryBadge category={script.category} />
            </div>
            <p>{script.longDescription ? script.longDescription : script.description}</p>

            {scriptType === 'community' ?
                (<div className="community-script-details">
                    <div className="author-info">
                        <h3>Community Script</h3>
                        <p>About this script:</p>
                        <div className="script-metadata">
                            <span>Author: {script.author || 'Anonymous'}</span>
                            <span>Downloads: {script.downloadCount || 0}</span>
                            <span>Rating: {script.rating || 'Not rated'}</span>
                        </div>
                    </div>

                    {executionError && <div className="error-message">{executionError}</div>}

                    <Button
                        onClick={() => onDownload(script)}
                        type="button"
                        variant="run"
                        disabled={isDownloading}
                        className="download-button"
                    >{isDownloading ? "Downloading..." : "Download Script"}</Button>
                </div>) :
                (
                    <>
                        <form onSubmit={(e) => { e.preventDefault(); onRun(formData, script) }} className="script-form">
                            {script.parameters && script.parameters.map((param) => (
                                <FormGroup label={param.label} key={param.name} htmlFor={param.name} >
                                    {renderInput(param)}
                                </FormGroup>
                            ))}
                            {executionError && <div className="error-message">{executionError}</div>}

                            <Button
                                type="submit"
                                disabled={isRunning}
                                variant="run"
                            >{isRunning ? 'Running Script...' : 'Run Script'}</Button>
                        </form>
                        {scriptType === 'my' && (
                            <Button
                                type="button"   
                                variant="run" 
                                className="upload-button" 
                                onClick={() => onUpload(script)}
                                disabled={isUploading}>
                                {isUploading ? 'Uploading...' : 'Share Script'}
                            </Button>
                        )}

                        <OutputConsole title="Execution details" content={output}></OutputConsole>
                    </>
                )}
                    
            


        </section>
    );
}

export default ScriptDetailView