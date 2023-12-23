import { ResponseDto } from "src/utils/response.dto";

export class CreateVendorResponse extends ResponseDto {
    data?: any
}

export class GetVendorListResponse extends ResponseDto {
    data?: any
    totalCount?: number
}

export class GetVendorByIdResponse extends ResponseDto {
    data?: any
}

export class UpdateVendorResponse extends ResponseDto {
    data?: any
}