import React, { Component } from "react";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import axios from "../../axios-orders";

export class BurgerBuilder extends Component {
  state = {
    purchasing: false
  };

  componentDidMount() {
    this.props.getIngredients();
    console.log(this.props.match);
  }

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({
        purchasing: true
      });
    } else {
      this.props.setAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  cancelPurchaseHandler = () => {
    this.setState({
      purchasing: false
    });
  };

  continuePurchaseHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push({
      pathname: "/checkout"
    });
  };

  isPurchaseable = () => {
    const ingredientKeys = Object.keys(this.props.ingredients);

    const ingredientCount = ingredientKeys
      .map(igKey => {
        return this.props.ingredients[igKey];
      })
      .reduce((prev, curr) => {
        return prev + curr;
      }, 0);

    return ingredientCount <= 0;
  };

  render() {
    const disabledInfo = {
      ...this.props.ingredients
    };

    for (const key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;

    let burger = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.props.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingredients} />
          <BuildControls
            price={this.props.totalPrice}
            ingredientAdder={this.props.onIngredientAdded}
            ingredientRemover={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchaseable={this.isPurchaseable()}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuthenticated}
          />
        </Aux>
      );

      orderSummary = (
        <OrderSummary
          ingredients={this.props.ingredients}
          cancelPurchase={this.cancelPurchaseHandler}
          continuePurchase={this.continuePurchaseHandler}
          totalPrice={this.props.totalPrice}
        />
      );
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} hider={this.cancelPurchaseHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingredientName =>
      dispatch(actions.addIngredient(ingredientName)),
    onIngredientRemoved: ingredientName =>
      dispatch(actions.removeIngredient(ingredientName)),
    getIngredients: () => dispatch(actions.getIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    setAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
