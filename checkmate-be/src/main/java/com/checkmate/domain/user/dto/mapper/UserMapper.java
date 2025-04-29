package com.checkmate.domain.user.dto.mapper;

import com.checkmate.domain.user.dto.request.UserUpdateRequest;
import com.checkmate.domain.user.dto.response.UserGetResponse;
import com.checkmate.domain.user.dto.response.UserUpdateResponse;
import com.checkmate.domain.user.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface UserMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromRequest(UserUpdateRequest request, @MappingTarget User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    UserUpdateResponse mapToUserUpdateResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)

    @Mapping(source = "id", target = "userId")
    @Mapping(source = "birth", target = "birth", dateFormat = "yyyy-MM-dd")
    @Mapping(source = "createdAt", target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    UserGetResponse mapToUserGetResponse(User user);
}
