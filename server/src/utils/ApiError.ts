interface ErrorDetail {
    field?: string
    message: string
}

class ApiError extends Error{
    statusCode: number
    success: boolean
    errors: ErrorDetail[]
    override message: string

    constructor( 
        statusCode: number, 
        message: string = 'Something went wrong', 
        errors: ErrorDetail[]=[], 
        stack: string = ''
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.success = false
        this.errors = errors
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
        
    }

}

export default ApiError