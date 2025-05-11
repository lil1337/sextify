export interface PathfinderQuery<Variables = Record<string, unknown>, OperationName = string, Sha256Hash = string> {
    "variables": Variables,
    "operationName": OperationName,
    "extensions": {
        "persistedQuery": {
            "version": 1,
            "sha256Hash": Sha256Hash
        }
    }
}