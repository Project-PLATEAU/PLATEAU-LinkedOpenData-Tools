const PredicateBox = (props) => {
    
    const getLinkURL = ((uri) => {
        const pattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/
        if (pattern.test(uri)) {
            return uri
        } else {
            const prefix = uri.split(":")[0]
            const name = uri.split(":")[1]
            return props.context[prefix] + name
        }
    })
    
    
    // ＠からはじまる属性は特別扱い
    if (props.predicate.includes("@")) {
        return (
            <>
            { props.predicate === '@context' && 
                <></>
            }
            { props.predicate === '@type' && 
            <></>
            // <div className="data-section__box">
            //     <p className="data-section__heading">rdf:type</p>
            //     <div className="data-section__content">
            //         {props.value}
            //     </div>
            // </div>
            }
            { props.predicate === '@id' && 
            <></>
            }
            </>
        )
    }
    // valueをそのまま返却すればOK
    if (typeof props.value !== "object") {
        return (
            <div className="data-section__box">
                <p className="data-section__heading"><a href={getLinkURL(props.predicate)} alt={"link to " + props.predicate}>{props.predicate}</a></p>
                <div className="data-section__content">
                    {props.value}
                </div>
            </div>
        )
    }
    
    // Valueが配列の場合は中身の型によって表示を切り替え
    if (typeof props.value === "object" && Array.isArray(props.value)) {
        return (
            <div className="data-section__box">
                <p className="data-section__heading"><a href={getLinkURL(props.predicate)} alt={"link to " + props.predicate}>{props.predicate}</a></p>
                <div className="data-section__content">
                    {Object.keys(props.value).map((item, index) => {
                        // return <div key={index}>aaa</div>
                        if (typeof props.value[item] === "object") {
                            return <PredicateBox key={index} predicate={item} value={props.value[item]} context={props.context} />
                        } else {
                            return <p key={item + '-' + index}>{props.value[item]}</p>
                        }
                    })}
                </div>
            </div>
        )
    } else {
        return (
            <>
                <div className="data-section__box">
                    <p className="data-section__heading"><a href={getLinkURL(props.predicate)} alt={"link to " + props.predicate}>{props.predicate}</a></p>
                    <div className="data-section__content">
                                
                        { props.value['@type'] && 
                            <p className="icon"><a href={getLinkURL(props.value['@type'])} alt={"link to " + props.value['@type']}>{props.value['@type']}</a></p>
                        }
                        { props.value['@id'] && 
                            <p className="data-section__content__data"><a href={getLinkURL(props["value"]["@id"])} alt={"link to " + props["value"]["@id"]}>{props["value"]["@id"]}</a></p>
                        }
                        { props.value['@value'] && 
                            <p className="data-section__content__data">{props["value"]["@value"]}</p>
                        }
                        { !props.value['@value'] && !props.value['@id'] &&
                            <>
                                {Object.keys(props.value).map((item, index) => {
                                    return <PredicateBox key={index} predicate={item} value={props.value[item]} context={props.context} />
                                })}
                            </>
                        }
                    </div>
                </div>                
            </>
        )
    }
}

export default PredicateBox
