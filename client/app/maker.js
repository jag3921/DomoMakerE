const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoHeight").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="height">Height: </label>
            <input id="domoHeight" type="text" name="height" placeholder="Domo Height (in meters)"/>
            <input id="csrfVal" type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoList = function(props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet Test</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age} </h3>
                <h3 className="domoHeight">Height: {domo.height} Meters</h3>
                <button onclick={()=>handleDeleteClick(domo._id)}>Delete me!</button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const handleDeleteClick = (domoid) => {
    const domoId = domoid;
    const _csrf = document.querySelector('#csrfVal') // use `document.querySelector()` to get this value
    const deleteData = `_csrf=${_csrf.value}&domoId=${domoId}`;
    // use this helper - sendAjax(type, action, data, success) 
    sendAjax('DELETE', '/delete-domo', deleteData, loadDomosFromServer);
  };

$(document).ready(function() {
    getToken();
});