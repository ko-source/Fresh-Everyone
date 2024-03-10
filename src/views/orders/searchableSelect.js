import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import style from "../../scss/searchableSelecte.scss";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const escapeStringRegexp = require("escape-string-regexp");

export default class SearchableSelect extends Component {
  state = {
    selectedItem: null,
    showDropdown: false,
    placeholder: "",
    list: null,
  };

  componentDidMount() {
    console.log(this.props.value);
    // this.setState({
    //   selectedItem: this.props.value,
    //   placeholder: '',
    // })
  }

  onItemSelect = (value) => (e) => {
    e.preventDefault();
    this.setState({
      selectedItem: value,
      placeholder: this.props.list[value].name,
    });
    this.toggleDropdown();
    if (this.props.onChange instanceof Function) {
      this.props.onChange(value);
    }
  };

  onToggleDropdown = (e) => {
    e.preventDefault();
    this.toggleDropdown();
  };

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown });
  };

  filterList = (query) => {
    this.setState({
      list: this.props.list.filter(
        (item) =>
          item.name.search(new RegExp(escapeStringRegexp(query), "i")) >= 0
      ),
    });
  };

  render() {
    return (
      <>
        <div style={{ position: "relative" }}>
          <div
            className="form-control"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={this.toggleDropdown}
          >
            <span>
              {this.props.list[this.state.selectedItem]?.name ||
                this.props.placeholder}
            </span>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          <ul
            className="itemList"
            style={{
              visibility: this.state.showDropdown ? "visible" : "hidden",
            }}
          >
            <input
              value={this.state.placeholder}
              onChange={(e) => {
                e.preventDefault();
                this.setState({ placeholder: e.target.value });
                this.filterList(e.target.value);
              }}
              className="form-control"
              type="text"
              placeholder="Search"
            />
            {(this.state.list || this.props.list).map((item, i) => (
              <li
                key={i}
                className={this.state.selectedItem === i ? "selected" : ""}
                onClick={this.onItemSelect(item.value)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
        <div
          onClick={this.toggleDropdown}
          style={{
            visibility: this.state.showDropdown ? "visible" : "hidden",
          }}
          className="backdrop"
        ></div>
      </>
    );
  }
}
