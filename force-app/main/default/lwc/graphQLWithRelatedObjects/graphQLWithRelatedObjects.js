import { LightningElement,wire,track,api } from 'lwc';
import { gql, graphql, refreshGraphQL } from "lightning/uiGraphQLApi";

const DELAY = 300;
export default class GraphQLWithRelatedObjects extends LightningElement {
    pageSizeOptions = [5,10,15,20];
    accounts;errors;graphqlQueryResult;
    searchKey = '';
    @track displayaccounts=[];
    @wire(graphql, {
        query: gql`
        query getAccountAndRelatedbjects($searchKey: String!, $limit: Int = 2000) {
            uiapi {
                query {
                    Account(
                        where: { Name: { like: $searchKey } }
                        first: $limit
                        orderBy: { Name: { order: ASC } }
                    ) {
                        edges {
                            node {
                                Id
                                Name {
                                    value
                                }
                                Contacts
                                {
                                    edges {
                                        node {
                                            Id
                                            Name {
                                                value
                                            }
                                        }
                                    }
                                }
                                Cases(
                                    orderBy: { LastModifiedDate: { order: ASC } }
                                ) {
                                    edges {
                                        node {
                                            Id
                                            CaseNumber{
												value
											}
                                            Subject {
                                                value
                                                displayValue
                                            }
                                            Owner  {
                                                ... on User {
                                                    Name {
                                                        value
                                                    }
                                                }
                                            }
                                            CreatedDate {
                                                displayValue
                                            }
                                            Id
                                            IsEscalated {
                                                value
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        `,
        variables: '$variables'
    })
    wiredValues(result) {
        this.isLoading = false;
        this.account = undefined;
        this.errors = undefined;
        this.graphqlQueryResult = result;
        const { errors, data } = result;
        if (data) {
            const accounts = data.uiapi.query.Account.edges.map((edge) => ({
                Id: edge.node.Id,
                Name: edge.node.Name.value,
                Contact: edge.node.Contacts,
                Case:edge.node.Cases
            }));
            if (accounts.length === 0) {
                this.errors = [`Couldn't find account.`];
            } else {
                this.accounts = accounts;
            }
        }
        if (errors) {
            this.errors = errors;
        }
    }

    handlePaginatorChange(event) {
        this.displayaccounts = event.detail;
    }

    get variables() {
        return {
            searchKey: this.searchKey === '' ? '%' : `%${this.searchKey}%`
        };
    }

    handleKeyChange(event) {
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }

    @api
    async handleRefresh() {
      return refreshGraphQL(this.graphqlQueryResult);
    }
}