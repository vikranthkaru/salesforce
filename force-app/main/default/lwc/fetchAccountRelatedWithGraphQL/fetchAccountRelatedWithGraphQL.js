import { LightningElement,wire,track } from 'lwc';
import { gql, graphql } from "lightning/uiGraphQLApi";

const DELAY = 300;
export default class FetchAccountRelatedWithGraphQL extends LightningElement {
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
        console.log('handlePaginatorChangehandlePaginatorChange-->');
        this.displayaccounts = event.detail;
    }

    get variables() {
        return {
            searchKey: this.searchKey === '' ? '%' : `%${this.searchKey}%`
        };
    }

    handleKeyChange(event) {
        console.log('ecv--.'+event.target.value);
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
}