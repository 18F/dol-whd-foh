var FOHApplication = React.createClass({
  render: function() {
    return (
      <div>
      <Header/>
      <Sidebar/>
      <Content/>
      </div>
    )
  }
});

var Header = React.createClass({
  render: function () {
    return (
      <div class="header">Header</div>
    );
  }
})

var Sidebar = React.createClass({
  render: function () {
    return (

      <div className="sidenav">
        <p>This is the sidebar</p>
        <SearchBox/>
      </div>

    );
  }
})

var SearchBox = React.createClass({
  render: function () {
    return (
      <div class="searchbox">
        <form className="usa-search usa-search-small">
          <input type="search" />
          <button type="submit"><span className="usa-sr-only">Search</span></button>
        </form>
        <input type="radio" />
      </div>
    )
  }
})

var Content = React.createClass({
  render: function () {
    return (
      <div id="content">Content</div>
    );
  }
})

React.render(
  <FOHApplication />,
  document.getElementById('container')
);