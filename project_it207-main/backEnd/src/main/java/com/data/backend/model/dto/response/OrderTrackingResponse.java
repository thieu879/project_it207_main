package com.data.backend.model.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@Data
public class OrderTrackingResponse {
    private String status;
    private LocalDateTime timestamp;
    private String location;
}
