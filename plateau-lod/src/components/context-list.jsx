

const ContextList = (props) => {
    
    if (typeof props.context === "object") {
        return (
            <div>
                { props.context &&
                    <table>
                        <tbody>
                        {Object.keys(props.context).map((item, index) => {
                            
                            return (
                                <tr key={item + "tr"}>
                                    <th key={item + "-tt"}>{item}</th><td key={item + "-td"}>{props.context[item]}</td>
                                </tr>
                            )
                                
                        })}
                        </tbody>
                    </table>
                }
            </div>
            
        )
    }
    
}

export default ContextList
